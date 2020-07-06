<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validation;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints\Email;
use Knp\Component\Pager\PaginatorInterface;
use App\Entity\User;
use App\Entity\Category;
use App\Entity\Video;
use App\Services\JwtAuth;
class VideoController extends AbstractController
{
    public function resJson($data){

        // Serializar datos con servicio serealizer
        $json = $this->get('serializer')->serialize($data, 'json');
        // Response con httpfoundation
        $response = new response();
        // Asignar contenido a la respuesta.
        $response->setContent($json);
        // Indicar formato de respuesta.
        $response->headers->set('Content-Type', 'application/json');
        // Devolver respuesta
        return $response;
    }
    // function new video.
    public function create (Request $request, JwtAuth $jwtAut) {

        // Recoger el token
        $token = $request->headers->get('Authorization', null);
        // comprobar si es correcto
        $tokenCheck = $jwtAut->checkToken($token);                
        // Recoger datos por post
        $json = $request->get('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);
        // Respuesta por defecto.
        $data = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Datos incorrectos'
        );
        if($tokenCheck && $params){
            
            // Recoger datos de usuario identificado.
            $identity = $jwtAut->checkToken($token, true);
            // datos para grabar.
            $user_id = $identity->sub;
            $id_user = $this->getDoctrine()->getRepository(User::class)->find($user_id);        
            $category = (int) (!empty($params->category_id) ? $params->category_id : null);
            $category_id = $this->getDoctrine()->getRepository(Category::class)->find($category);
            $title = (!empty($params->title) ? $params->title : null);
            $content = (!empty($params->content) ? $params->content : null);
            $url = (!empty($params->url) ? $params->url : null);   
            if(!empty($user_id)){
                
                $em = $this->getDoctrine()->getManager();
                // Comprobar usuario
                $user = $this->getDoctrine()->getRepository(User::class)->findOneBy([
                    'id' => $user_id
                ]);
                // guardar video.
                $video = new Video();                
                $video->setTitle($title);
                $video->setContent($content);
                $video->setUrl($url);
                $video->setStatus('normal');
                $video->setCreatedAt(new \Datetime('now'));
                $video->setUpdateAt(new \Datetime('now'));  
                $video->setUser($id_user);              
                $video->setCategory($category_id);
                
                $em->persist($video);
                $em->flush();

                            
               
                // Respuesta
                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'Video creado correctamente',
                    'video' => $video
                );
            }
        }        

        return $this->resJson($data);
    }

    // Metodo para traer videos por usuario

    public function getVideosByUser(Request $request, JwtAuth $jwtAut, PaginatorInterface $paginator, $id){

        // Recoger cabecera Authorization.
        $token = $request->headers->get('Authorization', null);
        // Comprobar el token.
        $tokenCheck = $jwtAut->checkToken($token);

        // Respuesta por defecto.
        $data = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'El usuario no tiene videos creados'
        );
        // Comprobar si es valida la autenticacion.
        if($tokenCheck){
            // Identidad del usuario
            $identity = $jwtAut->checkToken($token, true);
            $em = $this->getDoctrine()->getManager();

            // hacer una consulta para paginar
            $dql = "SELECT v FROM App\Entity\Video v WHERE v.user = {$id} ORDER BY v.id DESC";
            $query = $em->createQuery($dql);

            // Recoger parametro de la url.
            $page = $request->query->getInt('page', 1);
            $items_per_page = 6;

            // Invocar la paginacion.
            $pagination = $paginator->paginate($query, $page, $items_per_page);
            $total = $pagination->getTotalItemCount();
        
            // Preparar array response.
            $data = array(
                'status' => 'success',
                'code' => 200,
                'total_items_count' => $total,
                'page_actual' => $page,
                'items_per_page' => $items_per_page,
                'total_pages' => ceil($total / $items_per_page),
                'videos' => $pagination,
                'user_id' => $identity->sub


            );
            // Configurar bundle de paginacion.
        }

      
        return $this->resJson($data);
    }

    // Metodo para traer los videos por categoria.
    public function getVideosByCategory(Request $request, PaginatorInterface $paginator, $id){
        $videoByCategory = $this->getDoctrine()->getRepository(Video::class)->findBy(['category' => $id]);        
        // Recoger parametro de la url.
        $page = $request->query->getInt('page', 1);
        $items_per_page = 6;
        // Invocar la paginacion.
        $pagination = $paginator->paginate($videoByCategory, $page, $items_per_page);
        $total = $pagination->getTotalItemCount();     

        if(count($videoByCategory) > 0){
            $data = array(
                'status' => 'success',
                'code' => 200,
                'total_items_count' => $total,
                'page_actual' => $page,
                'items_per_page' => $items_per_page,
                'total_pages' => ceil($total / $items_per_page),
                'videos' => $pagination
            );
        }else{            
            $data = array(            
                'status' => 'error',
                'code' => 400,
                'message' => 'No existen videos con esta categoria'    
            );
        }
        return $this->resJson($data);
    }

    // Metodo para traer un video.
    public function getOneVideo($id){
        $video = $this->getDoctrine()->getRepository(Video::class)->findBy(['id' => $id]);
        if(count($video) > 0){
            $data = array(
                'status' => 'success',
                'code' => 200,
                'video' => $video
            );
        }else{
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'el video no existe'
            );
        }
        return $this->resJson($data);
    }

    // Metodo para traer todos los videos.
    public function getAllVideos(Request $request, PaginatorInterface $paginator){        

        $videos = $this->getDoctrine()->getRepository(Video::class)->findAll();        
        // Recoger parametro de la url.
        $page = $request->query->getInt('page', 1);
        $items_per_page = 6;
        // Invocar la paginacion.
        $pagination = $paginator->paginate($videos, $page, $items_per_page);
        $total = $pagination->getTotalItemCount();        
        if(count($videos) > 0){
            $data = array(
                'status' => 'success',
                'code' => 200,
                'total_items_count' => $total,
                'page_actual' => $page,
                'items_per_page' => $items_per_page,
                'total_pages' => ceil($total / $items_per_page),
                'videos' => $pagination
            );
        }else{
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'no exiten videos'
            );
        }
        return $this->resJson($data);
    }

    // Metodo para eliminar registros.
    public function destroy(Request $request, JwtAuth $jwtAut, $id){
        $token = $request->headers->get('Authorization', null);        
        $tokenCheck = $jwtAut->checkToken($token);

        $data = array(
            'status' => 'error',
            'code' => 200,
            'message' => 'Datos incorrectos'

        );
        if($tokenCheck){
            // Usuario identificado 
            $identity = $jwtAut->checkToken($token, true);
            // Doctrine
            $doctrine = $this->getDoctrine();
            // $em = $this->getManager();
            $em = $doctrine->getManager();
            $video = $doctrine->getRepository(Video::class)->findOneBy([
                'id' => $id,
                'user' => $identity->sub
            ]);
            if(is_object($video)){
                // Eliminar video

                $em->remove($video);
                $em->flush();
                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El video se elimino correctamente',
                    'video' => $video
                );
            }            
        }
       
        return $this->resJson($data);
    }

    // Metodo para modificar un video.
    public function update(Request $request, JwtAuth $jwtAut, $id){
        $token = $request->headers->get('Authorization');
        $tokenCheck = $jwtAut->checkToken($token);

        // Recoger datos.
        $json = $request->get('json', null);
        $params = json_decode($json);
        $params_array =  json_decode($json, true);

        $data = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Datos incorrectos'
        );
        if($tokenCheck && $params){
            $identity = $jwtAut->checkToken($token, true);

            $user_id = $identity->sub;       
            $category = (int) (!empty($params->category_id) ? $params->category_id : null);
            $category_id = $this->getDoctrine()->getRepository(Category::class)->find($category);
            $title = (!empty($params->title) ? $params->title : null);
            $content = (!empty($params->content) ? $params->content : null);
            $url = (!empty($params->url) ? $params->url : null); 

            $em = $this->getDoctrine()->getManager();
            // Comprobar usuario
            $video = $this->getDoctrine()->getRepository(Video::class)->findOneBy([
                'id' => $id,
                'user' => $user_id
            ]);
        
            if(is_object($video)){             
                // guardar video.               
                $video->setTitle($title);
                $video->setContent($content);
                $video->setUrl($url);
                $video->setUpdateAt(new \Datetime('now'));               
                $video->setCategory($category_id);
                
                $em->persist($video);
                $em->flush();

                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'Video actualizado',
                    'changes' => $video
                );
            }
        }
        
        return $this->resJson($data);
    }
    public function index()
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/VideoController.php',
        ]);
    }
}
